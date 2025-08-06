"use client"
import { useEffect, useState } from "react"


export default function Dashboard(){

    const [spaceId,setSpaceId] = useState("");
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
                dimensions:"400x400",
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
    useEffect(()=>{
        map()
    },[])
    return (
        <div>
            <h1>Dashboard</h1>
            <p>Space Id : {spaceId}</p>
            <div>
                
            </div>
        </div>
    )
}