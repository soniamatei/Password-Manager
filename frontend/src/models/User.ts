import {Profile} from "./Profile";

export interface User{
    id: number;
    created_at: string;
    last_modified: string;
    username: string;
    password: string;
    email: string;
    is_staff: number;
    is_active: number;
    nb_acc: number;
    nb_cls: number;
    nb_vls: number;
    nb_tgs: number;
    profile: Profile;
    per_page: string;
}