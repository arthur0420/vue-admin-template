<template>
 
<div style="margin-left:15px;" >
  <!--  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">role: {{ role }}</div>
  </div> -->
  <el-table
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="80">
      </el-table-column>
      <el-table-column
        prop="level"
        label="level"
        width="80">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="remark"
        width='400'>
      </el-table-column>
      <el-table-column
        prop="date"
        label="date"
        width='200'>
      </el-table-column>
    </el-table>

    
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :layout="layout"
      :total="total"
      v-bind="$attrs"
      @current-change="handleCurrentChange"
    />
    <!-- :page-sizes="pageSizes" -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {post } from '@/api/network'

export default {
  name: 'page1',
  props:{
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
     layout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    },
    background: {
        type: Boolean,
        default: true
      }
  },
  data(){
    return {
      list:null,
      total:0,
      thePage:1
    }
  },
  computed: { // 监控。
     currentPage: {
      get() { // this 是 page
        return this.page
      },
      set(val) { // this 是 组件。
        
      }
    },
    ...mapGetters([
      'name','role'
    ])
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      let rd = {
        funcNo:'1001',
        pageIndex:this.thePage,
        pageSize:this.limit
      }
      post(rd).then(r=>{
        let data = r.data;
        let total = r.total;
        this.list = data;
        this.total = parseInt(total);
        this.listLoading = false;
      });
    },
    handleCurrentChange(val){
      this.thePage = val;
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
