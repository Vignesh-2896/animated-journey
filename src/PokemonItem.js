import React from "react";

function PokemonItem (props) {

    return(
        <div className = "pokemon-item">
            <div className = "pokemon-item-image"><img alt = {props.pokeData["name"]} src = {props.pokeData["image"]} /></div>
            <div className = "pokemon-item-details">
                <h3 className = "pokemon-item-details-number" >#{props.pokeData["id"]}</h3>
                <h3 style = {{fontStyle:"italic"}} >{props.pokeData["name"]}</h3>
                {props.pokeData["types"].map(function(item,index){
                    return <h3 key = {`${props.pokeData["name"]}_${item.type["name"]}`} style = {{fontSize:"16px",display:"inline",margin:"2px"}} className = {item.type["name"]}  >{item.type["name"]}</h3>
                })}
            </div>
        </div>
    )

}


export {PokemonItem}