import { Field, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    Admin = 'Admin',
    HotelManager = 'HotelManager',
    Guest = 'Guest',
}

@Entity()
@ObjectType({ description: "A type defining a user"})
export class UserType {
    @PrimaryGeneratedColumn()
    @Field(() => String, { description: "User ID"})
    _id?: string;

    @Column()
    @Field(() => String, { description: "The email of the user"})
    email?: string;

    @Column()
    @Field(() => String, { description: "The role of the user"})
    role?: string;

    @Column()
    @Field(() => String, { description: "Hash of password"})
    hash?: string;

    @Column()
    @Field(() => String, { description: "The salt used in hashing"})
    salt?: string
}

@ObjectType({ description: "Access token"})
export class TokenType {
    @Field()
    token?: string;
}

@InputType({description: "User creation DTO"})
export class UserInput {
    @Field({nullable: false, description: "User email"})
    email?: string;

    @Field({nullable: false, description: "User password"})
    password?: string;
}

