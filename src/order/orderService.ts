import { ClientSession, ObjectId } from "mongoose";
import { OrderModel } from "./orderModal";
import { IOrder } from "./orderTypes";

export class OrderService {
    async createOrder(
        order: IOrder,
        session: ClientSession,
    ): Promise<IOrder[]> {
        return await OrderModel.create([order], { session });
    }
    async updateOrderPaymentStatus(id: string, status: string) {
        return await OrderModel.findOneAndUpdate(
            { _id: id },
            { paymentStatus: status },
            { new: true },
        );
    }

    async getOrdersByCustomerId(id: ObjectId) {
        return await OrderModel.find({ customerId: id }, { cart: 0 });
    }
    async getOrderByIdWithCustomer(id: string, customerId?: string) {
        return await OrderModel.findOne({ _id: id }, { cart: 0 }).populate(
            customerId ? "customerId" : "",
        );
    }
    async getOrderById(id: string) {
        return await OrderModel.findOne({ _id: id }, { cart: 0 });
    }
    async getOrderByIdWithProjection(
        id: string,
        projection: Record<string, number>,
    ) {
        return await OrderModel.findOne({ _id: id }, projection).populate(
            "customerId",
        );
    }
}
