import { createUrl, registerVisitor } from "$backend/client";
import { custom_logger } from "$services/functions/utils";
import { validateUrl } from "$services/functions/validation";
import type { LINK_OBJ, USER, VISITOR_OBJ } from "$services/types";
import type { Actions } from "@sveltejs/kit";

// import type { PageServerLoad } from "./$types"

// export const load: PageServerLoad = async (props) => {
//     const { cookies, locals } = props;

//     custom_logger("SOME DATA", "some data", { clear: true });

//     return {
//         somedata: "somedata in apge"
//     }
// }

export const actions: Actions = {
    newLink: async ({ request, cookies, locals }) => {
        const data = await request.formData();
        const input_val = data.get("input_val") as string;

        const visitor_data = JSON.parse(data.get("visitor_data") as string);

        const current_user: USER | null = locals.current_user || null;

        if (!input_val) return {
            message: "STARE",
            data: null,
            status: 401,
        };

        if (!validateUrl(input_val)) return {
            message: "NOT_A_VALID_URL",
            data: null,
            status: 409,
        };

        if (current_user) {
            const newLink: LINK_OBJ = {
                user_id: current_user._id as string,
                visitor_id: "",
                original: input_val, // short_link generated in the backend
                clicks: 0,
                status: "Active",
                alias: "",
                createdAt: new Date().toDateString(),
            };

            const res = await createUrl(newLink);

            custom_logger("form res", res)

            return {
                message: "NEW_LINK_ADDED",
                data: res.data,
                status: 200
            }
        }

        // NO USER SECTION. WILL CHECK FOR VISITORS AND ALL

        const visitor = JSON.parse(cookies.get("visitor") || "null");
        // const visitor_chances = cookies.get("visitor_chances");

        custom_logger("THIS VISITOR", visitor)

        if (visitor && +visitor.chances <= 0) {
            return {
                message: "OUT_OF_CHANCES",
                data: null,
                status: 401,
            };
        }

        let visitor_id;

        if (visitor && visitor.visitor_id === visitor_data.visitorId) {
            custom_logger("vistor already exits", { visitor });
            visitor_id = visitor.visitor_id;
        }
        else {
            visitor_id = visitor_data.visitorId;

            const _new_visitor: VISITOR_OBJ = { // the rest of the object created in the from body function
                links: [], // this is going to 
                visitor_id, // from fingerprintjs
                user_id: null, // just incase.
                createdAt: new Date().toDateString()
            }

            const vis_res = await registerVisitor(_new_visitor);

            cookies.set("visitor", JSON.stringify(vis_res.data), { path: "/" });

            custom_logger("new visitor", vis_res);
        }

        const newLink: LINK_OBJ = {
            user_id: "",
            visitor_id,
            original: input_val, // short_link generated in the backend
            clicks: 0,
            status: "Active",
            alias: "",
            createdAt: new Date().toDateString(),
        };

        const res = await createUrl(newLink);

        // custom_logger("this url res", res);

        return {
            message: "NEW_LINK_ADDED",
            data: res.data,
            status: res.status
        }


        // custom_logger("current_user", current_user);
        // custom_logger("visitor_data", visitor_data);
    }
}

/* 
const hanldeSubmit = async (e) => {
        const formEl = e.target as HTMLFormElement;

        const my_toaster = new TOAST_SERVICE(toast);

        if (!input_val.trim()) return my_toaster.STARE(); // 👀

        if (!validateUrl(input_val)) {
            input_val = "";
            return my_toaster.NOT_A_VALID_URL();
        }

        const user_id = getUserOrAgentId(current_user);

        console.log("input_val validation", validateUrl(input_val));

        const newLink: LINK_OBJ = {
            user_id,
            original: input_val, // short_link generated in the backend
            clicks: 0,
            status: "Active",
            alias: "",
            createdAt: new Date().toDateString(),
        };

        fetch(formEl.action, {
            method: "POST",
            body: JSON.stringify(newLink)
        }).then(_ => _.json())
            .then(({ data }) => {
                LINK_STORE.update((currentData) => getUniqueArray(currentData, data));
                my_toaster.NEW_LINK_ADDED();
                temp_link = data;
            })
            .catch(() => my_toaster.AN_ERROR_OCCURE());

        input_val = "";
    };
*/
