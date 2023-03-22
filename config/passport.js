const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const { ExtractJwt } = require('passport-jwt')
const JWTStrategy = require('passport-jwt').Strategy
var knex = require("../knex");
const common = require('../common/common')
const dotenv = require('dotenv').config()

passport.use(
    "jwt",
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromHeader("authorization"),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true,
        },
        async (req, payload, done) => {
            console.log("JWTStrategypayload", payload);
            try {
                // let query = knex.raw(`select u.id, u."name", u.surname, u.email, u.image, (select jsonb_agg(json_build_object('menu_name', m.menu_title, 'menu_id',
                //   gpm.sub_menu_id, 'permission', (select jsonb_agg(json_build_object('permission_id', gpm2.permission_id, 'permission_name', mp."name", 'type', mp."type"))
                // from group_permission_mapping gpm2
                // left join master_permissions mp on gpm2.permission_id = mp.id  where m.id = gpm2.sub_menu_id )))
                // as menus
                // from "group" g
                // left join user_group_mapping ugm on g.id = ugm.group_id
                // left join group_permission_mapping gpm on g.id = gpm.group_id
                // left join menus m  on m.id = gpm.sub_menu_id
                // where ugm.user_id = u.id)
                // from users u where u.id = '0f5c265f-c446-410c-8205-03651b829799'`)

                let user_id = common.decrypt(payload.sub);
                console.log(user_id.toString(), "user_id.toString()");
                let userSelect = [
                    `users.id`,
                    `users.name`,
                    `users.surname`,
                    `users.email`,
                    `users.image`,
                ],
                    groupSelect = [
                        `group.id as group_id`,
                        `group.name as group_name`,
                        `group.type as group_type`,
                    ],
                    menuSelect = [`menus.id`, `menus.menu_title`, `menus.level`];
                let query = knex("users")
                    .select([
                        ...userSelect,
                        ...groupSelect,
                    ])
                    .leftJoin(
                        `user_group_mapping`,
                        `user_group_mapping.user_id`,
                        "=",
                        `users.id`
                    )
                    .leftJoin(`group`, `group.id`, "=", `user_group_mapping.group_id`)
                    .where(`users.id`, user_id)
                    .first();

                console.log("query", query.toSQL());
                let result = await query;
                console.log("result", result);
                if (result.group_id) {
                    let menuquery = knex
                        .from("group_permission_mapping")
                        .select(menuSelect)
                        .select(
                            knex.raw(
                                `json_agg(json_build_object('permission_id',??,'permission_name',??,'permission_type',??,'is_permission_allowed',??)) as permissions`,
                                [
                                    `group_permission_mapping.permission_id`,
                                    `master_permissions.name`,
                                    `master_permissions.type`,
                                    `group_permission_mapping.is_permission_allowed`,
                                ]
                            )
                        )
                        .leftJoin(
                            `master_permissions`,
                            `master_permissions.id`,
                            `group_permission_mapping.permission_id`
                        )
                        .leftJoin(`menus`, function () {
                            this.on(
                                "menus.id",
                                "=",
                                "group_permission_mapping.sub_menu_id"
                            ).andOn(`menus.level`, "=", 3);
                        })
                        .andWhereRaw(
                            `group_permission_mapping.group_id = '${result.group_id}'`
                        )
                        .where(`menus.level`, 3)
                        .andWhere(`menus.is_deleted`, 1)
                        .groupBy(menuSelect);
                    console.log("menuquery", menuquery.toSQL());
                    result.menus = await menuquery;
                }
                req.user = result;
                console.log("req.user", req.user);
                return done(null, result);
            } catch (error) {
                console.log("JWT_SECRET");
                return done(
                    {
                        success: 0,
                        message: error.message,
                        data: {},
                    },
                    false
                );
            }
        }
    )
);

passport.use('jwtAdmin', new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, async (req, email, password, done) => {
    try {
        console.log(req, email, password, 'req, email, password');
        let query = knex(process.env.USERS).where('email', email)
            .andWhere('password', common.encryptPWD(password))
            .andWhere("isdeleted", 1)
        console.log(query, 'query');
        let result = await query
        console.log(result, 'result');
        if (result.length) {
            done(null, result)
        } else {
            done("Invalid Credentials", false)
        }
    } catch (e) {
        return done(e, false)
    }
}
))




