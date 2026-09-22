import { Schema, model, models } from 'mongoose';
const JobSchema = new Schema({
  title:{type:String,required:true,trim:true}, slug:{type:String,required:true,unique:true}, company:{type:String,required:true,trim:true}, companyLogo:String,
  description:{type:String,default:''}, requirements:{type:String,default:''}, skills:{type:[String],default:[]}, location:{type:String,required:true}, experience:{type:String,default:'Fresher'}, salary:String,
  workMode:{type:String,enum:['Remote','Hybrid','On-site'],default:'Remote'}, jobType:{type:String,enum:['Full-time','Internship','Contract'],default:'Full-time'}, category:{type:String,default:'Software Developer'}, companyType:{type:String,default:'Startup'},
  applicationUrl:{type:String,required:true}, companyWebsite:String, postedDate:{type:Date,default:Date.now}, deadline:Date, featured:{type:Boolean,default:false}, verified:{type:Boolean,default:false}, status:{type:String,enum:['published','draft','expired'],default:'published'}
},{timestamps:true});
export const Job = models.Job || model('Job', JobSchema);

