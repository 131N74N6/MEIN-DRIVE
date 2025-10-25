export default function DataModifier() {
    const deleteData = async (api_url: string) => {
        const request = await fetch(api_url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer `
            },
            method: 'DELETE'
        });

        await request.json();
    }

    const getData = async () => {}

    const infiniteScroll = async () => {}

    return { deleteData, getData, infiniteScroll }
};