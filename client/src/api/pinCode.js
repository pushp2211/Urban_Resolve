export const fetchPinCodeRes = async(pinCode)=>{
    const res = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);

    return res;
}