function test(f){
    let x = 5
    f()
}
function inF(){
    console.log(2*x)
}

test(inF)