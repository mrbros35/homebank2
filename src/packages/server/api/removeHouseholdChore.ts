import { Request, Response } from "../lib/expressTypes";
import { tokenIsValid, userCanAccessRecord } from "../auth/verifyAuth";
import { UserType } from "../db/user";
import { removeHouseholdChore } from "../db/chore";
import { RecordType } from "../db/record";

export const route = {
    path: "/api/v2/removeHouseholdChore",
    method: 'post',
    disabled: false,
    route: async (req: Request, res: Response) => {
        const validationResult = await tokenIsValid(req.cookies.loginKey);

        if (!validationResult.success || !validationResult.user || validationResult.user.role != UserType.Parent) {
            res.send({
                failed: true,
                data: null,
            });
            return;
        }

        if (!(await userCanAccessRecord(validationResult.user.id, req.body.choreId, RecordType.Chore))) {
            res.send({
                failed: true,
                data: null
            });
            return;
        }

        const data = await removeHouseholdChore(req.body.choreId);

        res.send({
            failed: false,
            data: data,
        });
    },
};