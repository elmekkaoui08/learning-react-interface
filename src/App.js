import {BiCalendar} from "react-icons/bi"
import {Search} from "./components/Search"
import {AddAppointment} from "./components/AddAppointment";
import {useState, useEffect, useCallback } from "react";
import {AppointmentDetails} from "./components/AppointmentDetails";

function App() {
    let [appointments, setAppointments] = useState([]);
    let [keyword, setKeyword] = useState('');
    let [sortBy, setSortBy] = useState('petName');
    let [orderBy, setOrderBy] = useState('asc');

    const filteredAppointments = appointments.filter(
        item =>
            item.petName.toLowerCase().includes(keyword.toLowerCase()) ||
            item.ownerName.toLowerCase().includes(keyword.toLowerCase()) ||
            item.aptNotes.toLowerCase().includes(keyword.toLowerCase())
    ).sort((a, b)=>{
        let order = (orderBy === 'asc') ? 1 : -1;
        return (a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order);
    })

    let fetchData = useCallback(() => {
        fetch('./appointments.json')
            .then(response => response.json())
            .then(data => setAppointments(data))
            .catch(err => console.log(err));
    }, []);

    useEffect(()=>{fetchData()}, [fetchData])

    let onDeleteAppointment = (id)=>{
        setAppointments(appointments.filter(item => item.id!==id));
    }

    let onAddAppointment = (data)=>{
        setAppointments([...appointments, data]);
    }
  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-5">
        <BiCalendar className="inline-block text-red-400 align-top" />Your Appointments</h1>
        <AddAppointment onAddAppointment={(data)=>onAddAppointment(data)}/>
        <Search className='mt-3'
                keyword={keyword}
                onSearch={(keyword)=>setKeyword(keyword)}
                onSortChange={(sort) => {setSortBy(sort)}}
                onOrderByChange={(order) =>{setOrderBy(order)}}
                sortBy={sortBy}
                orderBy={orderBy}
        />
      <ul className='divide-y divide-grey-200'>
        {
            filteredAppointments.map((item, index)=>(
                <AppointmentDetails appointement={item} onDeleteAppointment={onDeleteAppointment} key={index}/>
              )
          )
        }
      </ul>
    </div>
  );
}

export default App;
