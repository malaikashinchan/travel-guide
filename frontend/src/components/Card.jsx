import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function ActionAreaCard({ data, type }) {
    let imageUrl
    if(type === 'destination') imageUrl = "./assests/Destination.jpg"
    else if(type === 'hotel') imageUrl = "./assests/hotel.jpg"

    return (
        <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={data.image_url ? data.image_url : imageUrl}
                    alt="green iguana"
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {data.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}