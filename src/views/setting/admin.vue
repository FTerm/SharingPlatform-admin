<template>
  <div class="app-container" style="width:100%;">
    <el-button type="primary" @click="dialogVisible2=true">+新建管理员</el-button>
    <el-table :data="tableData" style="width: 100%;margin-top: 30px;" highlight-current-row border>
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">
          <i class="el-icon-s-custom"></i>
          <span style="margin-left: 10px">{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="帐户名" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.userName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="管理员所属角色" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.adminRoleName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.adminRoleDescription }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :formatter="formatDate1" />
      <el-table-column prop="lastLoginTime" label="登陆时间" align="center" :formatter="formatDate2" />
      <el-table-column label="状态" style="width: 20%" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.adminActive === 0" style="color: red;">禁用</div>
          <div v-else-if="scope.row.adminActive === 1" style="color: #409EFF;">正常</div>
        </template>
      </el-table-column>

      <el-table-column label="登录IP" style="width: 20%" align="center">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.loginIp }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

          <el-popconfirm title="确定删除此管理员吗？" @onConfirm="handleDelete(scope.$index, scope.row)">
            <el-button slot="reference" size="mini" type="danger">删除</el-button>
          </el-popconfirm>

          <!-- <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="信息修改" :visible.sync="dialogVisible" width="500px" :before-close="handleClose">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="真实姓名" prop="adminRealName" style="width:400px">
          <el-input placeholder="请输入真实姓名" v-model="ruleForm.adminRealName"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="adminPassword" style="width:400px">
          <el-input placeholder="请输入新密码" v-model="ruleForm.adminPassword"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="adminActive" style="width:400px">
          <el-select v-model="ruleForm.adminActive" placeholder="请选择帐号状态">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:400px">
          <el-button type="primary" @click="submitForm1('ruleForm')">修改</el-button>
          <el-button @click="resetForm1('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      title="新建管理员"
      :visible.sync="dialogVisible2"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        :model="ruleForm2"
        :rules="rules2"
        ref="ruleForm2"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="登录名" prop="adminName" style="width:400px">
          <el-input placeholder="请输入管理员登录名" v-model="ruleForm2.adminName"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="adminRole" style="width:400px">
          <el-select v-model="ruleForm2.adminRole" placeholder="请选择管理员角色">
            <el-option
              v-for="(item,index) in DataList"
              :key="index"
              :label="item.title"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="width:400px">
          <el-button type="primary" @click="submitForm2('ruleForm2')">立即创建</el-button>
          <el-button @click="resetForm2('ruleForm2')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :hide-on-single-page="true"
        :page-size="List.per_page"
        layout="total, prev, pager, next, jumper"
        :page-count="List.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { pagination } from "@/api/setting";
import { Delete } from "@/api/setting";
import { Create } from "@/api/setting";
import { Modify } from "@/api/setting";
import { Role } from "@/api/setting";
import { setSupport, getSupport, setCookie, getCookie } from "@/utils/support";
export default {
  data() {
    return {
      currentPage4: 4,
      List: [],
      dialogVisible2: false,
      page: 1,
      dialogVisible: false,
      tableData: [],
      DataList: [],
      ruleForm: {
        adminRealName: null,
        adminPassword: null,
        adminActive: null,
        adminId: null
      },
      ruleForm2: {
        adminName: "",
        adminRole: ""
      },
      rules2: {
        adminName: [
          { required: true, message: "请输入帐户名", trigger: "blur" }
        ]
      },
      options: [
        {
          value: 1,
          label: "正常"
        },
        {
          value: 0,
          label: "禁用"
        }
      ]
    };
  },
  created() {
    this.request();
    // this.Role();
  },
  methods: {
    request() {
      pagination(this.page).then(res => {
        console.log(res);
        this.tableData = res.data.results;
        this.List = res.data;
      });
    },
    Role() {
      Role().then(res => {
        this.DataList = res.data.roles_list;
      });
    },
    handleEdit(index, row) {
    },
    handleDelete(index, row) {
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    submitForm1(formName) {
    },
    resetForm1(formName) {
    },
    submitForm2(formName) {
    },
    resetForm2(formName) {
    },
    handleSizeChange(val) {
    },
    handleCurrentChange(val) {
      this.page = val;
      pagination(val).then(res => {
        this.tableData = res.data.results;
        this.List = res.data;
      });
    },
    formatDate1(row) {
      if (row.createTime === null) {
        return;
      } else {
        let date = new Date(parseInt(row.createTime));
        let Y = date.getFullYear() + "-";
        let M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1) + "-"
            : date.getMonth() + 1 + "-";
        let D =
          date.getDate() < 10
            ? "0" + date.getDate() + " "
            : date.getDate() + " ";
        let h =
          date.getHours() < 10
            ? "0" + date.getHours() + ":"
            : date.getHours() + ":";
        let m =
          date.getMinutes() < 10
            ? "0" + date.getMinutes() + ":"
            : date.getMinutes() + ":";
        let s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      }
    },
    formatDate2(row) {
      if (row.lastLoginTime === null) {
        return;
      } else {
        let date = new Date(parseInt(row.lastLoginTime));
        let Y = date.getFullYear() + "-";
        let M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1) + "-"
            : date.getMonth() + 1 + "-";
        let D =
          date.getDate() < 10
            ? "0" + date.getDate() + " "
            : date.getDate() + " ";
        let h =
          date.getHours() < 10
            ? "0" + date.getHours() + ":"
            : date.getHours() + ":";
        let m =
          date.getMinutes() < 10
            ? "0" + date.getMinutes() + ":"
            : date.getMinutes() + ":";
        let s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  min-width: 1500px;
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }

  .red {
    color: red;
  }
}
</style>
