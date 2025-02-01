export function on(events) {
    if (typeof events === 'function') events = {[events.name]: events}
    
}