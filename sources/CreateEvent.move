module 0x5a11629621d7f79fe39531900297eec60bb30e5d1b8eab1547bb4de58e15cc1a::create_event {
 use std::signer;
    use std::string;
    use std::vector;

    // Define a struct to hold event details
    struct Event has copy, drop, store {
        title: string::String,
        description: string::String,
        url: string::String,
        image_url: string::String,
    }

    // Define a resource to store events
    struct EventStore has key {
        events: vector<Event>,
    }

    // Initialize the EventStore for the account
    public fun initialize_account(account: &signer) {
        move_to(account, EventStore {
            events: vector::empty<Event>(),
        });
    }

    // Function to create a new event
    public fun create_event(
        account: &signer,
        title: string::String,
        description: string::String,
        url: string::String,
        image_url: string::String,
    ) acquires EventStore {
        let event_store = borrow_global_mut<EventStore>(signer::address_of(account));
        vector::push_back(&mut event_store.events, Event {
            title,
            description,
            url,
            image_url,
        });
    }
}
