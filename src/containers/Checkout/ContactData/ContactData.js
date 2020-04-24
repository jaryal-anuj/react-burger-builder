import React, { Component } from "react";
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/';


class ContactData extends Component{
    state={
        orderForm :{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your Name'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Zipcode'
                },
                value:'',
                validation:{
                    required:true,
                    minLength:5,
                    maxLength:5
                },
                valid:false,
                touched:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Country'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your Email'
                },
                value:'',
                validation:{
                    required:true
                },
                valid:false,
                touched:false
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[{value:'fastest', displayValue:'Fastest'}, {value:'cheapest', displayValue:'Cheapest'}]
                },
                validation:{},
                value:'fastest',
                valid:true

            },
        },
        formIsValid : false,
     
    }

    orderHandler=(event)=>{
        event.preventDefault();
    
        const formData={};

        for(let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order ={
            ingredients:this.props.ings,
            price:this.props.price,
            orderData:formData
        }
        
        this.props.onOrderBurger(order);
    }

    checkValidity(value,rules){
        let isValid = true;
        if(!rules){
            return true;
        }
        if(rules.required){
            isValid=value.trim() !=='' && isValid;

        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength  && isValid
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid
        }

        return isValid;
    }

    inputChangeHandler=(event,inputIndentifier)=>{
        const updatedOrderForm ={
            ...this.state.orderForm
        }

        const updatedFormElement = { ...updatedOrderForm[inputIndentifier] };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid= this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedFormElement.touched = true;
        updatedOrderForm[inputIndentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIndentifier in  updatedOrderForm){
            formIsValid = updatedOrderForm[inputIndentifier].valid && formIsValid;
        }
        this.setState({orderForm:updatedOrderForm, formIsValid:formIsValid});
    }

    render(){
        const formElementArray = [];
        for(let key in this.state.orderForm){
            formElementArray.push({id:key,config:this.state.orderForm[key]});
        }
        let form =(
            <form onSubmit={this.orderHandler}>
                    
                    {formElementArray.map(formElement=>(
                            <Input 
                                key={formElement.id}
                                elementType={formElement.config.elementType} 
                                elementConfig={formElement.config.elementConfig} 
                                changed={(event)=>this.inputChangeHandler(event,formElement.id)}
                                invalid={!formElement.config.valid}
                                shouldValidate={formElement.config.validation}
                                touched={formElement.config.touched}
                                value={formElement.config.value} />
                    ))}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if(this.props.loading){
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact Data</h4>
                {form}
            </div>
        );
    }
}
const mapStateToProps = state=>{
    return{
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.totalPrice,
        loading:state.order.loading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger:(orderData)=> dispatch(actions.purchaseBurger(orderData))
    }
    
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));