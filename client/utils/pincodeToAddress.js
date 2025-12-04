import { fetchPinCodeRes } from "../src/api/pinCode";

export async function fetchAddressDetails(pinCode) {
    if(!pinCode){
        console.warn("Pin code is required");
        return;
    }
    try {
        const response = await fetchPinCodeRes(pinCode);
        const resp = await response.json();
        return resp;
    } catch (error) {
        console.error("failed to fetch pinCode address details");
    }
}