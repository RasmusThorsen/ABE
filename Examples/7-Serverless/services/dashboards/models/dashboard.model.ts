import { Widget } from "./widget.model";

export interface Dashboard {
    userId: string;
    widgets: Widget[];
}