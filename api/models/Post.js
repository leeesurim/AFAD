import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
      },
      desc: {
        type: String,
        required: true,
      },
      photo: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        default:""
      },
      town: {
        type: String,
        default:""
      },
      sell_amount:{
        type:Number,
        default:""
      },
      price:{
        type:Number,
        default:""
      },
      num_people:{
        type:String,
        default:""
      },
      start_date:{
        type:String,
        default:""
      },
      end_date:{
        type:String,
        default:""
      },      
      categories:{
        type: Array,
        required: false,
      },
    },
    { timestamps: true }
  );

export default mongoose.model("Post", PostSchema);