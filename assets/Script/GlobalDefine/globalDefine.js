/*
 * @Author: wsf
 * @Date: 2018-08-25 17:07:48
 * @LastEditors: wsf
 * @LastEditTime: 2018-08-25 17:19:57
 * @Description: 
 */

 var Global = Global || {};

 Global.CAR_STATE = {
    NULL:-1,//初始状态  null
    STATIC:0,//静止状态  车在车位上
    RUN:1,//车在轨道上 运动状态
};

module.exports = {
    CarState:Global.CAR_STATE,
};