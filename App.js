import React from 'react'
import { Alert, Image, StyleSheet, Text, TextInput,
		TouchableOpacity, View, ScrollView, StatusBar,} 
			from 'react-native'

export default class App extends React.Component {
	constructor() {
		super()
		this.current = <LogIn container={this} />
	}
	render() {
		return <View>{this.current}</View>
	}
	toLogInPage() {
		this.current= <LogIn container={this} />
		this.forceUpdate()
	}
	toProductPage() {
		this.current= <ProductList container={this} />
		this.forceUpdate()
	}
}

var Settings = {
	base: 'http://codestar.work:3000',
	// base: 'http://localhost:3000'
}

class LogIn extends React.Component {
	render() {
		return <View style={Style.main}>
			<Text style={Style.brand}>Your Brand</Text>
			<TextInput placeholder="Your Email"
				style={Style.textInput}
				autoFocus
				autoCapitalize="none" 
				value={this.state.email} 
				onChangeText={t=>this.setState({email:t}) } />
			<TextInput placeholder="Your Password"
				style={Style.textInput}
				secureTextEntry={true} 
				value={this.state.password} 
				onChangeText={t=>this.setState({password:t}) } />
			<TouchableOpacity style={Style.button}
				onPress={()=>this.check()}>
				<Text style={Style.buttonText}>Log In</Text>
			</TouchableOpacity>
			<Text>{this.state.data}</Text>
		</View>
	}
	constructor() {
		super()
		this.state = {email: '', password: '', data:'...' }
	}
	check() {
		fetch(Settings.base + '/service/user-login',
			{
				method:'post',
				headers: {
					'Accept': '*/*',
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: 'email=' + this.state.email + '&password=' + this.state.password
			})
		.then(r => r.json())
		.then(d => {
			if (d.result == 'OK') {
				this.props.container.toProductPage()
			}
		})
	}
}

class ProductList extends React.Component {
	constructor() {
		super()
		this.state = { products: [ ] }
		fetch(Settings.base + '/service/product-list')
		.then(r => r.json())
		.then(d => this.setState({products:d}))
	}
	render() {
		return <ScrollView style={Style.main}>
			{this.state.products.map( (v,i) => <TouchableOpacity key={i}>
				<View style={Style.product}>
					<Image source={{uri: Settings.base + '/photo' + v.photo}} 
							style={Style.productImage} />
					<View style={{flexDirection:'column'}}>
						<Text style={Style.productTitle}>{v.name.substring(0, 20)}</Text>
						<Text style={Style.productDetail}>{v.detail.substring(0, 100)}</Text>
					</View>
				</View>
			</TouchableOpacity>
			)}
		</ScrollView>
	}
}

class Home extends React.Component {

}

var Style = {
	main: { padding:8, paddingTop:40}, 
	brand: { fontSize:32, textAlign:'center', margin:10},
	button: { width:'100%', },
	buttonText: { fontSize:20, color:'black', textAlign:'center' },
	textInput : { borderWidth: 2, borderColor:'#ccc', borderStyle:'solid', height: 40,
					padding:2, paddingLeft:4, marginBottom:4 },
	product: { flexDirection: 'row', backgroundColor:'#fafafa', marginBottom:2,
				height: 120},
	productImage: {width: 120, height:120, marginRight:2, borderWidth:2,
					borderColor:'#ccc' },
	productTitle: {fontSize: 20, overflow:'hidden'},
	productDetail: {color:'#888', overflow:'hidden'}
}
