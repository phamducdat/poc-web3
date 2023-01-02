import React, {useState} from "react";
import abi from '../../utils/BuyMeACoffee.json';
import {Button, Col, Form, Input, Row} from "antd";


const Home = props => {
    const contractAddress = "0x26B5FDF3d05D3F4c312dB1d2E85287aDe19F31a9";
    const contractABI = abi.abi;

    const [currentAccount, setCurrentAccount] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [memos, setMemos] = useState("")


    const connectWallet = async () => {
        try {
            const {ethereum} = window;

            if (!ethereum) {
                console.log("please install MetaMask")
            }


            const accounts = await ethereum.request({
                method: 'eth_requestAccounts'
            });


            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <p>Buy Datpd a Coffee!</p>
            {currentAccount ?
                <>
                    <Form
                        layout={"vertical"}
                    >
                        <Row justify={"center"}>
                            <Col span={4}>
                                <Form.Item
                                    label={"Name"}
                                    name={"name"}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify={"center"}>
                            <Col span={4}>

                                <Form.Item
                                    label={"Send Datpd a message"}
                                    name={"message"}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </>

                :


                <Button onClick={connectWallet}>
                    Connect your wallet
                </Button>

            }
        </>
    )
};

Home.propTypes = {};

export default Home;