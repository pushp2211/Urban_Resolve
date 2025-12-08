import { System } from "../models/system.model.js"
import { asyncHandler } from './asyncHandler.js';


export async function getLastCleanUp(){
    const record = await System.findOne({key:"lastCleanUp"});

    return record ? new Date(record.value) : null;
}

export async function setLastCleanUp (){
    await System.findOneAndUpdate(
        {key:"lastCleanUp"},
        {value: new Date() },
        {upsert:true, new: true}
    )
}