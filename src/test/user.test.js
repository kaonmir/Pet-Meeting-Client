import "babel-polyfill"
import mysql from 'mysql';
import Chat from '../models/chat';
import Pet from '../models/pet';
import User from '../models/user';
import UserService from '../services/user';

//userService 는 const로 가져오면 안되나? 변수랑 상수의 차이
const redis = require("../../node_modules/redis");
//model을 가져오는 것이니 위쪽에서 
const config = require("../../config.json"); // Options 
// const userObject=require("./Use")
var userService;
var user;
//signup 
//connection은 beforeAll 이 scope안에서 다시 사용할 계획이니까 
beforeAll(() => {
    const connection = mysql.createConnection(config.MySQLOption);

    const { port, host } = config.RedisOption;
    const client = redis.createClient(port, host);
    connection.connect();
     userService = new UserService(
        new User(connection),
        new Image(connection),  
        new Pet(connection),
        new Chat(client)
        //chat은 constructor가 client임 
    );

 

})
//접속에 필요한 연결 객체를 생각한다. 
//registration page -> 로그인 flow

describe('test for UserService', async () => {
    await it('should exist', async () => {
       
        const exist = await userService.exist('Sony');
        expect(exist).toBe(true);
    });
    
    
    
});

describe('test for Userservice ',async () => {
    await it('should not exist', async () => {
        
        const doesNotExist = await userService.exist('aadfdfi');
        expect(doesNotExist).toBe(false);
    });
});

//login pass correct id and pw
describe('test for login failure',async() => {
    await it('should not exist', async () => {
         const {error, uid} = await userService.login("aaa","bbb");
        
         // 1. error == undefined , uid 가 옴
         // 2. error msg, uid undeifned
    //authentification error거나 로그인 에러

        // if (loginResult.toEqual(user.errorParser))
        //     return "loginError";
        // else if (loginResult.toEqual("No User!"))
        //     return "No user";
        // else (loginResult.toEqual(result[0].UID))
        //     return "loginSuccess";
            expect({error,uid}).toEqual({
                error:'No User!',
                uid:undefined

            });
        
    });


});

describe('test for login success',async()=> {
    // var loginFlag=false;
    // await it('should  exist', async () => {
    //     const {error,uid}=await userService.login("Sonny");
    //     if(error.toBe("error"))
    //         loginFlag=false
    //     else 
    //         loginFlag=true
        
    // })
    // return loginFlag
    await it('should  exist', async () => {
        const {error,uid}=await userService.login("Sony","Sung");
        expect({error,uid}).toEqual({
            error:undefined,
            uid: uid

    });

    })
});