import { useForm } from "react-hook-form";
import { IChangePass } from "../../Interfaces";

export default function ModifyPassword() {
    const { register, handleSubmit } = useForm<IChangePass>();

    const changePassSubmit = (data: IChangePass) => {

    }
}