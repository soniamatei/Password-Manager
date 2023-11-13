import { Vault } from "./Vault";
import { TagPassword } from "./TagPassword";
import {User} from "./User";

export interface Tag {
    id: number;
    nb_acc: number;
    title: string;
    vault: Vault | number;
    tagged_passwords: TagPassword[];
    user: User|number;
}