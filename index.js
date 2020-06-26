

const express=require('express');
const app=express();
const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 

let heights=[];//For Storing The Bounces And The Peak
let t=[];//For Storing The Time Coordinate
let h=[];//For Storing The Height Coordinate

const g=9.8;

class Json {
    constructor(height,e,time,coord,bounces) {
      this.height = height;
      this.e = e;
      this.time = time;
      this.coord = coord;
      this.bounces=bounces;
    }
  } //For Storing in a Json File



let mem=[];




const calc= (height,e)=>{
    let i=0;

    while(height>1)//If the net bounce height is less than 1 unit,not considering it
    {
        heights.push(height);
        height=height*e*e;
        i++;
    
    }

    return i; //Returning The Occurrences

}


const calcHeight=(uCur,hCur)=>{

    let x=(Math.sqrt(2*g*hCur+uCur*uCur)-uCur)/g; //Calculating Time With H and Inital Velocity 

    return x;

}

const calcTime=(height,e)=>{

    let u=0,x=0,bounces=heights.length,time=0;

    while(x<bounces)
        {
            
            let _height=0,u=0,prev_time=0;

            if(x>0)    
                prev_time=t[t.length-1];
   
            if(x%2)
                u=Math.sqrt(heights[x-1]*9.8*2)*e;
            
            let k=t.length-1,k_i=t.length-1;
        
            while(_height<=heights[x])
                {   
                    k_i++;
                    h.push(_height);
                   time=calcHeight(0,_height)
                    t.push(time+prev_time);
                    u=Math.sqrt(2*g*_height+u*u);
                    _height+=1;//Checking The Time after change in height of 1 unit
    
                }
            
                let cons=t.length-1;

            if(x>0)//No Ascent For Start
            for(k;k<k_i;k++)//Calculating THe Difference Since Time For Ascent equal time For descent
             {   
                t.push(t[k+1]-t[k]+t[cons++]);
                h.push(--_height);    
            }

                x++;

        }

}



app.get('/',(req,res)=>{
  
       let height=req.query.height,e=req.query.e;

        if(e<0||height<0||e>1)
            res.send('Incorrect Values Taken');
else {

    let bounces="";
        if(e===1)
 {     bounces="INFINITY";
    for(let n=0;n<2;n++)
       heights.push(height);
}else  bounces=calc(height,e); 

       calcTime(height,e);
        let obj =new Json(height,e,t,h,bounces);//Creating The Object
        mem.push(obj);//Storing In The Json FILE

        t=[];//Clearing
        h=[];//Clearing
        heights=[];

     res.json(obj);//Sending
     
}



});

app.get('/all',(req,res)=>{

    res.json(mem);

});


app.listen(5000,()=>{
    console.log('Server Live');
});
