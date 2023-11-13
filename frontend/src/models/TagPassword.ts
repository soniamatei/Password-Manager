import {PasswordAccount} from "./Account"
import {Tag} from "./Tag"

export interface TagPassword {
    "id": number,
    "created_at": string,
    "description": string,
    "tag": Tag,
    "password": PasswordAccount
}