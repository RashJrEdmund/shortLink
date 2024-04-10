import { loginWithEmailPassword } from "$backend/client";
import { SET_COOKIE_OPTIONS } from "$services/constants/cookie_options";
import { custom_logger } from "$services/functions/utils";
import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
    default: async (e) => {
        try {
            const { request, cookies } = e;

            const data = await request.formData();
            const email = data.get("email") as string;
            const password = data.get("password") as string;

            if (!email || !password) return {
                message: "Missing form fields",
                email: email ?? "",
                status: 401,
            };

            const res = await loginWithEmailPassword({ email, password });

            if (!res.data || res.status !== 200) return {
                message: "Incorrect email or password",
                status: 404,
                data: res,
            };

            const { data: { user, token } } = res;

            cookies.set("token", token, SET_COOKIE_OPTIONS);

            return {
                message: `welcome back ${user.username || user.email}`,
                status: 200,
                current_user: user,
            };
        } catch(ee) {
            console.log({ee})
            return {
                messsage: "AN_ERROR_OCCURED",
                status: 500,
                data: null,
            }
        }
    },
};
