import mongoose,{Schema,Types} from "mongoose";

interface ICredit extends Document{
    credit:number,
    date: Date;
    userId:Types.ObjectId;
    serviceKey:string;
}

const creditSchema = new Schema<ICredit>({
    credit:{
        type:Number,
        required:true,
        default:0
    },
    date:{
        type:Date,
        required:true,
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    serviceKey:{
        type:String,
        required:true
    }
})

export const Credit = mongoose.model<ICredit>('Credit',creditSchema)