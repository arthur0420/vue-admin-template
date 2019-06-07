<template>
  <div class="app-container">
    <div style="height:50px;">
      <span style="margin-right:30px;">动物总数：{{animalGross}}</span>
      <el-button size="mini" type="success" icon="el-icon-plus" v-on:click="showAdd"></el-button>
    </div>
    <el-table
      v-loading="listLoading"
      v-bind:data="list"
      element-loading-text="Loading"
      border
      fit
      @row-dblclick="dblclick"
    >
      <el-table-column align="center" prop="pl_name" label="产线" width="95"></el-table-column>
      <el-table-column align="center" prop="ap_name" label="房间" width="95"></el-table-column>
      <el-table-column align="center" prop="delivery_fed" label="已产仔/总量" width="95"></el-table-column>
      <el-table-column align="center" prop="addGross" label="已增加" width="95"></el-table-column>
      <el-table-column align="center" prop="minus" label="已减少" width="95"></el-table-column>
      <el-table-column align="center" prop="unableFeed" label="无法饲喂" width="95"></el-table-column>
      <el-table-column align="left" prop="rate" label="当前进度" width="100">
        <template slot-scope="props">
          <span>{{props.row.rate}}</span>
          <el-progress :percentage="props.row.rateNum" :show-text="false"></el-progress>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="80%">
      <el-form
        :model="ruleForm"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number="ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { post } from "@/api/network";
export default {
  filters: {},
  data() {
    return {
      list: null,
      listLoading: true,
      animalGross: 0,
      dialogVisible: false,
      ruleForm: {
        pass: "",
        checkPass: "",
        age: ""
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    showAdd() {
      this.dialogVisible = true;
    },
    dblclick(row, event) {
      console.log(row);
      // console.log(event);
    },
    getList() {
      this.listLoading = true;
      let rd = {
        funcNo: "1002",
        dataType: "detail"
      };
      post(rd).then(r => {
        let rdata = r.data;

        this.listLoading = false;
        var animalGross = 0;
        for (var i = 0; i < rdata.length; i++) {
          var one = rdata[i];
          one["delivery_fed"] = one.deliveryGross + "/" + one.animalGross;
          one["rate"] = one.fedGross + "/" + one.weightGross;
          one["rateNum"] =
            ((one.fedGross / one.weightGross) * 100).toFixed(0) * 1;
          animalGross += one.animalGross;
        }
        this.list = rdata;
        this.animalGross = animalGross;
        // $("#animalGross").html(animalGross);
      });
    }
  }
};
</script>
