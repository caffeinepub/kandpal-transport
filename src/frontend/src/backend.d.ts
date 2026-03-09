import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Inquiry {
    id: bigint;
    name: string;
    submittedBy: Principal;
    email: string;
    message: string;
    timestamp: Time;
    phone: string;
}
export type Time = bigint;
export interface backendInterface {
    getAllInquiries(): Promise<Array<Inquiry>>;
    getInquiriesByUser(user: Principal): Promise<Array<Inquiry>>;
    submitInquiry(name: string, phone: string, email: string, message: string): Promise<void>;
}
