<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">+新建角色</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column align="center" label="Code" width="220">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>
      <el-table-column align="center" label="描述">
        <template slot-scope="scope">{{ scope.row.des }}</template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" width="30%" :title="dialogType==='edit'?'编辑角色':'新建角色'">
      <el-form :model="role" label-width="90px" label-position="left">
        <el-form-item label="角色名称">
          <el-input v-model="role.title" :disabled="disabled" placeholder="角色名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="role.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="角色描述"
          />
        </el-form-item>
        <el-form-item label="Code">
          <el-input v-model="role.code" :disabled="disabled" placeholder="角色代号" />
        </el-form-item>
        <el-form-item label="功能选择">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            show-checkbox
            node-key="code"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// -------------------------------------------//
// 注意！！！！！//
// 这个用户角色的代码可以自己重新编写//
// -------------------------------------------//
import { getRoutes, Role, Deleterole, AddRole,Modification } from "@/api/setting";
import path from "path";
import { deepClone } from "@/utils";
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  code: "",
  title: "",
  description: "",
  routes: [],
};

export default {
  data() {
    return {
      str:'',
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogType: "new",
      checkStrictly: false,
      defaultProps: {
        children: "children",
        label: "title"
      },
      disabled: false
    }
  },
  computed: {
    routesData() {
      return this.routes;
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes();
    this.request();
  },
  methods: {
    async getRoutes() {
      const res = await getRoutes();
      this.serviceRoutes = res.permission_list;
      this.routes = this.getTree(res.permission_list);
    },
    request() {
      Role().then(res => {
        this.rolesList = res.roles_list;
        console.log(res);
      });
    },

    // Reshape the routes structure so that it looks the same as the sidebar

    getTree(list) {
      return check(null, list);
      function check(value, list) {
        const arr = list.filter(item => {
          return item.Parent_code === value;
        });
        arr.forEach((item, index) => {
          if (item.code === "Index") {
            arr[index].disabled = true;
          }
          const result = check(item.code, list);
          if (result.length > 0) {
            arr[index].children = result;
          }
        });
        return arr;
      }
    },
    generateArr(list) {
      const router = list.map(item => {
        return item.code;
      });
      return router;
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(['Index'])
      }
      this.dialogType = "new";
      this.dialogVisible = true;
      this.disabled = false;
    },
    
    handleEdit(scope) {
      this.role.title = scope.row.title
      this.role.code = scope.row.code
      this.role.description = scope.row.des
      this.dialogType = "edit";
      this.dialogVisible = true;
      this.checkStrictly = true;
      this.$nextTick(() => {
        const routes = this.getTree(this.role.routes);
        this.$refs.tree.setCheckedNodes(this.getTree(routes));
        this.$refs.tree.setCheckedKeys(this.generateArr(scope.row.permission))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false;
        this.disabled = true;
      });
    },
    handleDelete({ $index, row }) {
      this.$confirm("是否删除此权限?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await Deleterole(row.code);
          this.request();
        })
        .catch(err => {
          console.error(err);
        });
    },
    async confirmRole() {
      const isEdit = this.dialogType === "edit";
      const checkedKeys = this.$refs.tree.getCheckedKeys();
      const parentArr = this.$refs.tree.getHalfCheckedKeys();
      var arr = checkedKeys.concat(parentArr);
      if (isEdit) {
        var datalist = {
          title: this.role.title,
          code: this.role.code,
          description: this.role.description,
          permission:arr
        };
        console.log(datalist.permission)
        Modification(datalist).then(res=>{
          console.log(res)
          this.request()
        })
      } else {
        var datalist = {
          title: this.role.title,
          code: this.role.code,
          description: this.role.description,
          permission: arr
        };
        console.log(datalist.permission)
        AddRole(datalist).then(res => {
          console.log(res);
          if(res.errCode === 0){
            this.request()
          }
        });
      }
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
