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
    <el-dialog title="添加动物"  :visible.sync="dialogVisible" width="350px">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="mini">
        <el-form-item   label="产线" prop="productLine" >
            <el-select v-model="ruleForm.productLine" @change="showAp"  placeholder="选择产线" >
              <el-option
                v-for="item in plData"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                >
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item   label="产房" prop="apartmentId" > 
          <el-select :disabled="showApFlag" v-model="ruleForm.apartmentId"  placeholder="选择产房" >
              <el-option
                v-for="item in apData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item   label="栏位序号" prop="noInApartment">
          <el-input maxlength='5' type="text" v-model="ruleForm.noInApartment" ></el-input>
        </el-form-item>
         <el-form-item   label="受精日期" prop="eventDate">
           <el-date-picker
            type="date"
            v-model="ruleForm.eventDate"
            placeholder="选择日期"
            :editable="false"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>
          <el-button @click="resetForm()">重置</el-button>
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
        productLine: "",
        apartmentId: '',
        noInApartment: '',
        eventDate:''
      },
      rules:{
        productLine:[{required:true,message:"请选择产线", trigger: 'blur' }],
        apartmentId:[{ required: true,message:"请选择产房", trigger: 'blur' }],
        noInApartment:[{ required: true, message: '请输入栏位编号', trigger: 'blur' }],
        eventDate:[{ required: true, message: '请选择产房', trigger: 'blur' }],
      },
      plData:[],
      apData:[],
      showApFlag:true,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }   
    };
  },
  created() {
    this.getList();
  },
  methods: {
    submitForm(){
      this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            // TODO  提交
          } else {
            return false;
          }
        });
    },
    resetForm(){
       this.$refs["ruleForm"].resetFields();
    },
    showAp(e){
      var contain = this.contain(this.plData,e);
      this.apData = contain.array;
      this.showApFlag = false;
    },
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

      rd = {
        funcNo:'1002',
		    dataType:"4dictionary"
      };
      post(rd).then(r =>{
        var rdata = r.data;
        var plData = new Array();
        for(var i = 0 ; i <rdata.length; i++){
          var one =  rdata[i];
          
          var isContain = this.contain(plData,one["pl_no"]);
          if(isContain!=null){
            var oneAp =	{
                value:one["id"],
                label:one["ap_name"]
              }
            isContain.array.push(oneAp);
          }else{
            var o = {
              value:one["pl_no"],
              label:one["pl_name"],
              array:[{
                value:one["id"],
                label:one["ap_name"]
              }]
            }
            plData.push(o);
          }
        }
        this.plData = plData;
      });
    },
    contain(a , plNo){
      for(var i = 0 ; i< a.length ; i++){
        var one = a[i];
        if(one["value"] == plNo){
          return one;
        }
      }
      return null;
    }
  }
};
</script>
