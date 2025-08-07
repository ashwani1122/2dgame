"use client"
import { useEffect, useState } from "react"
import ImageRenderer from "../components/ImageRenderer";


export default function Dashboard(){
    const [elementId,setElementId] = useState("");
    const [element , setElement] = useState<{element:{id:string,imageUrl:string,width:number,height:number,static:boolean},x:number,y:number}>({element:{id:"",imageUrl:"",width:0,height:0,static:false},x:0,y:0});
    const [spaceId,setSpaceId] = useState("");
    const [spaceData,setSpaceData] = useState<{dimensions:string , elements:[{element:{id:string,imageUrl:string,width:number,height:number,static:boolean},x:number,y:number}] }>({dimensions:"",elements:[{element:{id:"",imageUrl:"",width:0,height:0,static:false},x:0,y:0}]});
    async function map(){
        try{
            const maps = await fetch("http://localhost:3001/api/v1/space",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWR5YnpmdGUwMDAwdmw2aHU4dmliazgyIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU0Mzg1ODQ5fQ.KR11rzwJfRacd4i1nxQwOnC6KJGtl9CMZkl9wUSAERI"
            },
            body:JSON.stringify({
                name:"alaska",
                dimensions:"200x200",
                mapId:"cmdyg18f60007vlmqhqynepfe"
            })
        })
        if(!maps.ok){
            throw new Error("Failed to fetch")
        }
        const data = await maps.json();
        setSpaceId(data.spaceId);
        }catch(e){
            console.log(e)
        }
    }
    async function addELement(){
        try{
            const res = await fetch(`http://localhost:3001/api/v1/space/element`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWR5YnpmdGUwMDAwdmw2aHU4dmliazgyIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU0Mzg1ODQ5fQ.KR11rzwJfRacd4i1nxQwOnC6KJGtl9CMZkl9wUSAERI"
            },
            body:JSON.stringify({
                elementId:"cmdyewihw0003vlmq5sy2oxgh",
                spaceId:spaceId,
                x:399,
                y:-1800
            })
        })
        if(!res.ok){
            throw new Error("Failed to fetch")
        }
        const data = await res.json();
        setElementId(data)
        }catch(e){
            console.log(e)
        }
    }
    async function spaceJoin(){
        try{
            const res = await fetch(`http://localhost:3001/api/v1/space/${spaceId}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWR5YnpmdGUwMDAwdmw2aHU4dmliazgyIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNzU0Mzg1ODQ5fQ.KR11rzwJfRacd4i1nxQwOnC6KJGtl9CMZkl9wUSAERI"
            },
        })

    if(!res.ok){
        throw new Error("Failed to fetch")
    }
    const data = await res.json();
    setSpaceData(data);
    setElementId(data.elements[0].element.id);
    console.log("this is space data element "+data.elements[0].element.id)
    }catch(e){
        console.log(e)
    }
    }
    useEffect(()=>{
            map();
    },[])
    return (
        <div>
            <div>
                <button className="bg-blue-700 hover:scale-105 transition duration-300 ease-in-out" onClick={()=>spaceJoin()}>Join Space</button>
                <div className="flex flex-col justify-center items-center">
                    
                    <ImageRenderer data={spaceData}></ImageRenderer>
                    <button className="bg-blue-700 px-4 py-2 hover:scale-105 transition duration-300 ease-in-out" onClick={()=>addELement()}>Add Element</button>
                </div>
            </div>
        </div>
    )
}