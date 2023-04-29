import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@/components/Link';
import Container from '@mui/material/Container';

function Copyright(props: any) {
	return (
		<Typography
			variant='body2'
			color='text.secondary'
			align='center'
			{...props}>
			{'Copyright © '}
			<Link color='inherit' href='https://mui.com/'>
				Trendyy
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

function PricingContent() {
	return (
		<React.Fragment>
			<AppBar
				position='static'
				color='default'
				elevation={0}
				sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
				<Toolbar sx={{ flexWrap: 'wrap' }}>
					<Typography variant='h6' color='inherit' noWrap sx={{ flexGrow: 1 }}>
						Trendyy
					</Typography>

					<Button variant='outlined' sx={{ my: 1, mx: 1 }}>
						<Link
							sx={{ textDecoration: 'none' }}
							variant='button'
							href='/signin'>
							Login
						</Link>
					</Button>
					<Button variant='outlined' sx={{ my: 1, mx: 1 }}>
						<Link
							sx={{ textDecoration: 'none' }}
							variant='button'
							href='/signup'>
							SIGN UP
						</Link>
					</Button>
				</Toolbar>
			</AppBar>
			<Container
				disableGutters
				maxWidth='sm'
				component='main'
				sx={{ pt: 8, pb: 6 }}>
				<Typography
					component='h1'
					variant='h2'
					align='center'
					color='text.primary'
					gutterBottom>
					Analyze Trends And Predict your market
				</Typography>
				<Typography
					variant='h5'
					align='center'
					color='text.secondary'
					component='p'>
					Quickly figure out what other people are saying about your brand on
					twitter
				</Typography>
			</Container>
		</React.Fragment>
	);
}

export default function Pricing() {
	return <PricingContent />;
}
