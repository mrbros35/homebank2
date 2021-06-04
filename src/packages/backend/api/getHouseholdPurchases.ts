import { Request, Response } from "../lib/expressTypes";
import { tokenIsValid, userCanAccessRecord } from "../auth/verifyAuth";
import { UserType } from "../db/user";
import { getHouseholdPurchases } from "../db/purchase";
import { RecordType } from "../db/record";
import { getHousehold } from "../db/household";

export = {
    path: "/getHouseholdPurchases",
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

        if (!(await userCanAccessRecord(validationResult.user.id, (await getHousehold(validationResult.user.household)).id, RecordType.Household))) {
            res.send({
                failed: true,
                data: null
            });
        }

        const data = await getHouseholdPurchases(validationResult.user.household);

        res.send({
            failed: false,
            data: data,
        });
    },
};