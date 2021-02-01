import {FindOptions} from "sequelize/types/lib/model";

import Interface from "../../repository/notification/Interface";
import Model     from "../../repository/notification/Model";
import Task      from "../../repository/notification/Task";

/**
 * @name Story
 */
export default class Story {
    /**
     * @name tasks
     */
    public tasks: {
        Notification: Task;
    };

    /**
     * @name Story
     */
    public constructor() {
        this.tasks = {
            Notification: Task.Instance(),

        };
    }

    public async list(conditions) {
        const where: FindOptions<Model["_attributes"]>["where"] = {};
        const order: FindOptions<Model["_attributes"]>["order"] = [];

        return await this.tasks.Notification.getList({
            offset: conditions.skip || 0,
            limit: conditions.limit || 10,
            where: where,
            order: order,
        });
    }

    public async one(conditions) {
        const data = await this.tasks.Notification.getOne({
            where: conditions,
            rejectOnEmpty: true,
        });

        return data && <Interface>data.toJSON();
    }

    public async create(body: Interface) {
        const data = await this.tasks.Notification.createOne(body);

        return data && <Interface>data.toJSON();
    }
}
