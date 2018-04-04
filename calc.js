var p=7
var s=2
var arr=[]
for(var i=0;i<10;i++){
  var temp = {no:i+1}
  arr.push(temp)
}
var toNowBet = 0
for(var i=0;i<arr.length;i++){
  if(i==0){
    var temp = arr[i]
    temp.bet = s*p
    temp.srWin = s*(10-p)
    temp.toNowRet = (10-p)/10
    temp.toNowBet = temp.bet
    toNowBet = temp.toNowBet
    arr.splice(i,1,temp)
  }else{
    var temp = arr[i]
    // var triple = Math.ceil((toNowBet+(i+1)*s*(10-p))/(s*(10-p)))
    // var triple = Math.floor((toNowBet+(i+1)*s*(10-p))/(s*(10-p)))
    // var triple = Math.floor(toNowBet/(s*(10-p)))
    var triple = Math.ceil(toNowBet/(s*(10-p)))
    temp.bet = triple*s*p
    temp.srWin = triple*s*(10-p)
    temp.toNowRet = Math.pow((10-p)/10,i+1)
    temp.toNowBet = temp.bet+toNowBet
    toNowBet = temp.toNowBet
    arr.splice(i,1,temp)
  }
}

console.log("============================================"+p+"码================================================")
for(var i in arr){
  console.log("轮数:"+arr[i].no+" 本轮投注:"+arr[i].bet+" 本轮中奖金额:"+arr[i].srWin+" 累计概率"+arr[i].toNowRet+" 累计投入"+arr[i].toNowBet)
  // console.log("轮数:"+arr[i].no+" 本轮单注:"+arr[i].bet/7)
}
console.log("============================================"+p+"码================================================")
