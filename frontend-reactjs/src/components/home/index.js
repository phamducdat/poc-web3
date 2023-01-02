import React, {useEffect, useState} from "react";
import abi from '../../utils/BuyMeACoffee.json';
import {Button, Col, Form, Input, Row} from "antd";
import {ethers} from "ethers";
import {Footer} from "antd/es/layout/layout";


const Home = props => {

    const [form] = Form.useForm()

    const contractAddress = "0x26B5FDF3d05D3F4c312dB1d2E85287aDe19F31a9";
    const contractABI = abi.abi;

    const [currentAccount, setCurrentAccount] = useState("")
    const [name, setName] = useState("")
    const [message, setMessage] = useState("")
    const [memos, setMemos] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let buyMeACoffee;
        isWalletConnected();
        getMemos();

        const onNewMemo = (from, timestamp, name, message) => {
            console.log("Memo received: ", from, timestamp, name, message);
            setMemos([
                ...memos,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message,
                    name
                }
            ]);
        };

        const {ethereum} = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum, "any");
            const signer = provider.getSigner();
            buyMeACoffee = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            buyMeACoffee.on("NewMemo", onNewMemo);
        }
        return () => {
            if (buyMeACoffee) {
                buyMeACoffee.off("NewMemo", onNewMemo);
            }
        }
    }, [])

    const isWalletConnected = async () => {
        try {
            const {ethereum} = window;

            const accounts = await ethereum.request({method: 'eth_accounts'})
            console.log("accounts: ", accounts);

            if (accounts.length > 0) {
                const account = accounts[0];
                console.log("wallet is connected! " + account);
            } else {
                console.log("make sure MetaMask is connected")
            }
        } catch (error) {
            console.log("error: ", error)
        }
    }

    const getMemos = async () => {
        try {
            const {ethereum} = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const buyMeACoffee = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                console.log("fetching memos from the blockchain...");
                const memos = await buyMeACoffee.getMemos();
                console.log("fetched!")
                setMemos(memos);
            } else {
                console.log("Metamask is not connected");
            }
        } catch (error) {
            console.log(error);
        }
    }


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

    const buyCoffee = async (value) => {
        try {
            setLoading(true)
            const {ethereum} = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum, "any");
                const signer = provider.getSigner();
                const buyMeACoffee = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                console.log("buying coffee..")
                const coffeeTxn = await buyMeACoffee.buyCoffee(
                    value.name, value.message,
                    {value: ethers.utils.parseEther("0.001")}
                );

                await coffeeTxn.wait();

                console.log("mined ", coffeeTxn.hash);

                console.log("coffee purchased!")
                form.resetFields()
                setLoading(false)
            }
        } catch (err) {
            console.log(err)
            setLoading(false)
        }
    }

    return (
        <>
            <p>Buy Datpd a Coffee!</p>
            {currentAccount ?
                <>
                    <Form
                        layout={"vertical"}
                        onFinish={buyCoffee}
                        form={form}
                    >
                        <Row justify={"center"}>
                            <Col span={4}>
                                <Form.Item
                                    label={"Name"}
                                    name={"name"}
                                    initialValue={"anon"}
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
                                    initialValue={"Enjoy your coffee!"}
                                >
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row justify={"center"}>
                            <Col>
                                <Button type={"primary"} htmlType="submit">
                                    Send 1 Coffee for 0.001 ETH
                                </Button>
                            </Col>

                        </Row>
                    </Form>
                </>

                :


                <Button onClick={connectWallet}>
                    Connect your wallet
                </Button>

            }

            {currentAccount &&
                <Footer style={{marginTop: "160px"}}>
                    <p>Memos received</p>
                </Footer>
            }
            {
                currentAccount && (memos.map((memo, idx) => {
                    return (
                        <>
                            <p>From: {memo.name} at {memo.timestamp.toString()}</p>

                        </>
                    )
                }))
            }
        </>
    )
};

Home.propTypes = {};

export default Home;