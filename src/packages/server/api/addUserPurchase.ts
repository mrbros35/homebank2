import { Request, Response } from "../lib/expressTypes";
import { tokenIsValid } from "../auth/verifyAuth";
import { logUserPurchase } from "../db/purchase";

export const route = {
    path: "/api/v2/addUserPurchase",
    method: 'post',
    disabled: false,
    route: async (req: Request, res: Response) => {
        const validationResult = await tokenIsValid(req.cookies.loginKey);

        if (!validationResult.success || !validationResult.user) {
            res.send({
                failed: true,
                data: null,
            });
            return;
        }

        const data = await logUserPurchase(validationResult.user.id, req.body.item, req.body.amount);

        res.send({
            failed: false,
            data: data,
        });
    },
};