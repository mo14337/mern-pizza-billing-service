/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Consumer, EachMessagePayload, Kafka, Producer } from "kafkajs";
import { MessageBroker } from "../types/broker";
import { handleProductUpdate } from "../productCache/productUpdateHandler";
import { handleToppingUpdate } from "../toppingCache/toppingUpdateHandler";

export class KafkaBroker implements MessageBroker {
    private consumer: Consumer;
    private producer: Producer;
    constructor(clientId: string, brokers: string[]) {
        const kafka = new Kafka({ clientId, brokers });
        this.consumer = kafka.consumer({ groupId: clientId });
        this.producer = kafka.producer();
    }
    //consumer methods below
    async connectConsumer() {
        await this.consumer.connect();
    }
    async disconnectConsumer() {
        await this.consumer.disconnect();
    }
    async consumeMessage(topics: string[], fromBegining: boolean = false) {
        await this.consumer.subscribe({ topics, fromBeginning: fromBegining });
        await this.consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: EachMessagePayload) => {
                switch (topic) {
                    case "product":
                        await handleProductUpdate(message.value?.toString());
                        return;
                    case "topping":
                        await handleToppingUpdate(message.value?.toString());
                        return;
                    default:
                        console.log(
                            `Received message from ${topic}: ${message.value?.toString()}`,
                        );
                }
            },
        });
    }

    //producer methods below

    async connectProducer() {
        await this.producer.connect();
    }
    async disconnectProducer() {
        await this.producer.disconnect();
    }
    async sendMessage(topic: string, message: string) {
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
    }
}
