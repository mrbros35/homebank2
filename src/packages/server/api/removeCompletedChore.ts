import { Request, Response } from "../lib/expressTypes";
import { tokenIsValid, userCanAccessRecord } from "../auth/verifyAuth";
import { UserType } from "../db/user";
import { removeCompletedChore } from "../db/completedChore";
import { RecordType } from "../db/record";

export const route = {
    path: "/api/v2/removeCompletedChore",
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

        if (!(await userCanAccessRecord(validationResult.user.id, req.body.completedChoreId, RecordType.ChoreCompleted))) {
            res.send({
                failed: true,
                data: "Invalid useraccessrecord"
            });
            return;
        }

        const data = await removeCompletedChore(req.body.completedChoreId);

        res.send({
            failed: false,
            data: data,
        });
    },
};