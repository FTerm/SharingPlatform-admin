<template>
  <div class="app-container" style="width:100%;">
    <el-table ref="singleTable" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" align="center"></el-table-column>
      <el-table-column property="username" label="用户昵称" align="center"></el-table-column>
      <el-table-column property="phone" label="电话号码" align="center"></el-table-column>
      <el-table-column property="email" label="邮箱" align="center"></el-table-column>
      <el-table-column align="center" label="性别">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span v-if="scope.row.gender == 1">男</span>
            <span v-else-if="scope.row.gender == 2">女</span>
            <span v-else>保密</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" :formatter="formatDate" />
      <el-table-column align="center" property="updateTime" label="更新时间"></el-table-column>
      <el-table-column align="center" label="用户状态">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <span :class="{red:scope.row.status != 1}">{{ scope.row.status == 1?'正常':'不正常' }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="block" style="text-align:center;margin-top:20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="List.per_page"
        :hide-on-single-page="true"
        layout="total, prev, pager, next, jumper"
        :page-count="List.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ordinary } from "@/api/user";
export default {
  data() {
    return {
      page: 1,
      tableData: [],
      List: []
    };
  },
  created() {
    this.request();
  },
  methods: {
    request() {
      ordinary(this.page).then(res => {
        console.log(res);
        this.tableData = res.data.results;
        this.List = res.data;
      });
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.page = val;
      ordinary(val).then(res => {
        console.log(res);
        this.tableData = res.results;
        this.List = res;
      });
      console.log(val);
      // console.log(`当前页: ${val}`);
    },
    formatDate(row) {
      const date = new Date(parseInt(row.createTime));
      const Y = date.getFullYear() + "-";
      const M =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1) + "-"
          : date.getMonth() + 1 + "-";
      const D =
        date.getDate() < 10 ? "0" + date.getDate() + "" : date.getDate() + "";
      const h =
        date.getHours() < 10
          ? "0" + date.getHours() + ":"
          : date.getHours() + ":";
      const m =
        date.getMinutes() < 10
          ? "0" + date.getMinutes() + ":"
          : date.getMinutes() + ":";
      const s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + " " + h + m + s;
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
.red {
  color: red;
}

</style>