import './App.css';
import React, {useState, useEffect} from 'react';
import Loader from 'react-loader-spinner';
import { PokemonItem } from './PokemonItem';

function App() {
  
  const [pokemonList, setPokemonList] = useState([]);
  const [generationList, setGenerationList] = useState([])
  const [typeList, setTypeList] = useState([]);

  const [generationName, setGenerationName] = useState("");
  const [filterPokemonTypeList, setFilterPokemonTypeList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isPokemonLoading, setIsPokemonLoading] = useState(false)
  
  useEffect(() => {

    (async () => {
        let generationData = await fetchGenerationData("");
        generationData = generationData.results;
        generationData.forEach(async function(generationEntry,index){
          
          let generationInfo = await fetchGenerationData(index+1);

          let generationObject = {};
          generationObject["id"] = index + 1;
          generationObject["name"] = generationEntry["name"].toUpperCase()
          generationObject["region"] = generationInfo.main_region["name"].toUpperCase();

          let temp = generationList; temp.splice(index,0,generationObject); setGenerationList(temp);
        });

        let typeData = await fetchTypeData();
        typeData  = typeData.results;
        typeData.pop(); typeData.pop();
        typeData.forEach(function(typeItem){
          let temp = typeList; temp.push(typeItem.name); setTypeList(temp);
          if(temp.length === typeData.length){
            setTypeList(arr => [...arr,"Clear"]);
            setIsLoading(false)
          }
        }) 

    })();

  },[])


  const updateTypeData =  async (e) => {

    /*
    1. Check unchecked box
    2. Check no Pokemon List
    3. Check no Pokemon Found
    */

    let tempData = filterPokemonTypeList; tempData.push(e.target.value); setFilterPokemonTypeList(tempData)
    filterPokemon();
  }


  const filterPokemon = () => {

    let tempData = [];
    pokemonList.forEach(async function(pokemonEntry){
      let pokemonData = await fetchPokemonData(pokemonEntry["id"]);
      let pokemonTypes = pokemonData.types;
      pokemonTypes.forEach(function(pokemonTypeItem){
        if(filterPokemonTypeList.indexOf(pokemonTypeItem.type["name"]) !== -1){
          console.log(filterPokemonTypeList)
          tempData.push(pokemonEntry);
          setPokemonList([]); setPokemonList(tempData)
        }
      });
    });
  }

  const updatePokemonData = async(e) => {
    
    let pokemonAlteredName = {
      "deoxys" : "386",
      "wormadam" : "413",
      "shaymin" : "492",
      "giratina" :"487",
      "basculin" : "550",
      "darmanitan" : "555",
      "landorus" : "645",
      "keldeo" : "647",
      "thundurus" : "642",
      "tornadus" : "641",
      "meloetta" : "648",
      "meowstic" : "678",
      "aegislash" : "681",
      "pumpkaboo" : "710",
      "gourgeist" : "711",
      "wishiwashi" : "746",
      "oricorio" : "741",
      "lycanroc" : "745",
      "minior" : "774",
      "mimikyu" : "778",
      "indeedee" : "876",
      "eiscue" : "875",
      "zacian" : "888",
      "toxtricity" : "849",
      "urshifu" : "892",
      "zamazenta" : "889"
    }

    setIsPokemonLoading(true);
    setPokemonList([]);

    let generationData = await fetchGenerationData(e.target.value);
  
    setGenerationName(generationData.main_region["name"].toUpperCase());
    generationData = generationData.pokemon_species;

    let tempData = [];
    generationData.forEach(async function(generationItem){
      let pokemonData ;
      if(pokemonAlteredName[generationItem.name]) pokemonData = await fetchPokemonData(pokemonAlteredName[generationItem.name]);
      else pokemonData = await fetchPokemonData(generationItem.name);

      let pokemonObject = {};
      pokemonObject["name"] = capitalize(generationItem.name);
      pokemonObject["image"] =  pokemonData.sprites["front_default"];
      pokemonObject["types"] = pokemonData.types;
      pokemonObject["id"] = pokemonData.id;
      
      tempData.push(pokemonObject); tempData.sort((a,b) => a["id"] - b["id"])
      if(tempData.length === generationData.length){
        setIsPokemonLoading(false)
        setPokemonList(tempData)
      }
    });
  };

  return (
    <div>
      {isLoading
      ? ( <div className = "LoaderDiv"><Loader type="TailSpin" color="#00BFFF" height={120} width={120}/></div>)
      : (
        <div className="App">
          <h1>Pokemon App </h1>
          <div className = "filter">
            <form>
              <div className = "filterGeneration">
                <select onChange = {updatePokemonData}>
                  <option value = "">Choose a Generation</option>
                  {generationList.map(function(item){
                    return <option key = {item["id"]} value = {item["id"]} >{`${item["name"]} : ${item["region"]}`}</option>
                  })}
                </select>
              </div>
              <div className = "filterTypes">
                <h3>Select Pokemon Types : </h3>
                {typeList.map(function(item){
                  return  (
                    <div className = "filterTypes-item" key = {item}>
                      <input onChange = {updateTypeData} type = "checkbox" name = {`${item}_type`} value = {item} /><label className = {item} htmlFor = {`${item}_type`}>{capitalize(item)}</label>
                    </div>
                  )
                })}
              </div>
            </form>
          </div>
          {isPokemonLoading
            ? (<div className = "LoaderDiv"><Loader type="TailSpin" color="#00BFFF" height={120} width={120}/></div>)
            : (
              <div className = "pokemon_list">
                <h3 style = {{textAlign:"center"}}>{generationName}</h3>
                {pokemonList.map(function(item,index){
                  return <PokemonItem key = {index} pokeData = {item} />
                })}
             </div>
            )}
        </div>
        )}
      </div>
  );
}

const fetchGenerationData = async(generationNumber) => {
  let url = "https://pokeapi.co/api/v2/generation/"
  if(generationNumber) url = `https://pokeapi.co/api/v2/generation/${generationNumber}/`

  let response =  await fetch(url);
  response = await response.json();
  return response;
}

const fetchPokemonData = async(pokedexEntry) => {
  let response =  await fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexEntry}/`);
  response = await response.json();
  return response;
}

const fetchTypeData = async() => {
  let response = await fetch("https://pokeapi.co/api/v2/type/");
  response = await response.json();
  return response;
}

function capitalize(strParam){
  return strParam[0].toUpperCase() + strParam.slice(1);
}

export default App;
