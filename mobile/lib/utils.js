export function formatPublichDate(dateString){
    const date = new Date(dateString);
    const month = date.toLocaleDateString("Default",{month:"long"});
    const day= date.getDate();
    const year = date.getFullYear();
      
    return `${month} ${day}, ${year}`;
}