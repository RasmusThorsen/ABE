import { Arg, Ctx, Mutation, Resolver, Query } from "type-graphql";
import { Connection } from "typeorm";
import { TokenType, UserInput, UserRole, UserType } from "./user.types";
import { pbkdf2Sync, randomBytes } from 'crypto';
import { sign } from "jsonwebtoken";

@Resolver()
export class UserResolver {
    @Mutation(() => UserType, { description: "Used for creating a user"})
    async createUser(@Arg("user") userInput: UserInput, @Ctx() ctx: { db: Connection }) {
        if(!userInput.password || !userInput.email) {
            throw new Error("Password or Email missing");
        }
        
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(userInput.password, salt, 90000, 32, 'sha512').toString('hex');

        const repo = ctx.db.getRepository(UserType);
        var user = await repo.findOne({where: {email: userInput.email}});

        if(user) {
            throw new Error("Email already in use");
        }
        return repo.save({
            email: userInput.email,
            role: UserRole.Guest,
            salt,
            hash
        })
    }

    @Query(() => TokenType)
    async authenticate(@Arg("user") userInput: UserInput, @Ctx() ctx: { db: Connection }) {
        const repo = ctx.db.getRepository(UserType);
        const user = await repo.findOne({where: {email: userInput.email}});
        console.log(user);
        if(!user || !user.salt || !userInput.password) {
            throw new Error("Wrong email");
        };

        const matchingHash = user.hash == pbkdf2Sync(userInput.password, user.salt, 90000, 32, 'sha512').toString('hex');
        if(matchingHash) {
            const token = sign(
                {
                  id: user._id,
                  email: user.email,
                  role: user.role,
                },
                process.env.SECRET || '1234',
                { expiresIn: '1h' }
              );

            return { token };
        } else {
            throw new Error("Wrong password")
        }
    }

    @Query(() => [UserType])
    async getUsers(@Ctx() ctx: { db: Connection }) {
        const repo = ctx.db.getRepository(UserType);
        return await repo.find();
    }

    
    @Mutation(() => UserType, { description: "Used for creating a user"})
    async createAdmin(@Arg("user") userInput: UserInput, @Ctx() ctx: { db: Connection }) {
        if(!userInput.password || !userInput.email) {
            throw new Error("Password or Email missing");
        }
        
        const salt = randomBytes(16).toString('hex');
        const hash = pbkdf2Sync(userInput.password, salt, 90000, 32, 'sha512').toString('hex');

        const repo = ctx.db.getRepository(UserType);
        var user = await repo.findOne({where: {email: userInput.email}});

        if(user) {
            throw new Error("Email already in use");
        }
        return repo.save({
            email: userInput.email,
            role: UserRole.Admin,
            salt,
            hash
        })
    }
}
