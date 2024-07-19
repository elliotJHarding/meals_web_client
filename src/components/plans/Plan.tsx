import Plan from "../../domain/Plan.ts";
import {Card, CardMedia, Stack, Typography} from "@mui/material";
import {Restaurant} from "@mui/icons-material";
import Box from "@mui/material/Box";

export default function DayPlan({plan} : {plan: Plan}) {

    const empty =
        <Card>
            <CardMedia sx={{padding: 1}}>
                <Restaurant/>
            </CardMedia>
        </Card>

    const meal =
        <Card>
            <Box sx={{padding: 1}}>
                <Stack direction='row' gap={1}>
                    <CardMedia image={plan.dinner?.image?.url} sx={{borderRadius: 2, width: 50, height: 50}}/>
                    <Typography variant='h6'>
                        {plan.dinner?.name}
                    </Typography>
                </Stack>
            </Box>
        </Card>

    return (
        <Stack>
            <Typography fontWeight='bolder' textAlign='left'>
                {plan.date.toLocaleDateString('en-gb', {weekday: "long"})}
            </Typography>
            {plan.dinner == null ? empty : meal}
        </Stack>
    )

}