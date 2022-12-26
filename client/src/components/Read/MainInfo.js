import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { deleteData, post, get, getNoToken } from '../../utils/Axios';
import axios from 'axios';

import './mainInfo.scss';
import Title from "./_propeties/Title";
import RecruitingBtn from './_propeties/RecruitingBtn';
import Amount from './_propeties/Amount';
import NumPeople from './_propeties/NumPeople';
import PerPayment from './_propeties/PerPayment';
import Marchandise from './_propeties/Merchandise';
import Place from './_propeties/Place';
import Date from './_propeties/Date';
import LikeBtn from './_propeties/LikeBtn';
import JoinBtn from './_propeties/JoinBtn';
import Payments from '../../pages/Payments';

const BACK_SERVER = process.env.REACT_APP_URL + "/api";

function MainInfo (props) {
    const {user} = useContext(AuthContext);
    console.log(user);
    console.log(user._id);
    const navigate = useNavigate();
    const [friends, setFriends] = useState([]);


    const button = useRef();

    const [numPeople, setNumPeople] = useState(1);
    const [likeStatus, setLikeStatus] = useState(false);
    const [doJoin, setDoJoin] = useState(false);
    const [message, setMessage] = useState("");
    // const [letJoin, setLetJoin] = useState(false);

    // 참여 여부 확인하기
    const isJoined = async () => {
        const result = await axios.get(BACK_SERVER + "/joins/joinCheck", {params : {postId : props.data._id, userId : user._id}});
        // console.log(result.data.valid);
        const btn = button.current.querySelector(".ReadBtn");
        // console.log(button.current.querySelector(".ReadBtn"));
        if (result.data.valid) {
            btn.disabled = false;
            // setLetJoin(true);
        } else {
            btn.disabled = true;
            // setLoinJoin(false);
        }
    }

    // 참여하기
    const payComplete = async (message) => {
        setDoJoin(() => false);
        setMessage(() => "");

        if ( message == 'success' ) {
            console.log("joinPost");
            const result = await axios.post(BACK_SERVER+"/joins", {postId : props.data._id, userId : user._id});
            console.log(result);
            getNumPeople();
        } else {
            alert(message);
        }
    }

    // 현재 참여 인원 가져오기
    const getNumPeople = async () => {
        // console.log("getNumber");
        // console.log(props.data._id);
        const result = await axios.get(BACK_SERVER + "/joins/groupPeople", {params : {postId : props.data._id}});
        // console.log(result.data);
        setNumPeople(result.data);
    }

    // 좋아요 버튼
    const likePost = async () => {
        if (likeStatus) {
            // 좋아요 취소
            const result = await deleteData("/likes/delete", {data:{ postId : props.data._id, userId : user._id}});
            setLikeStatus(false);
        } else {
            // 좋아요
            const result = await post("/likes", {postId : props.data._id, userId: user._id});
            setLikeStatus(true);
        }
    }

    // 현재 좋아요 상태 가져오기
    const getLikeStatus = async () => {
        const result = await getNoToken("/likes/islike", {postId : props.data._id, userId: user._id});
        if (result.data == null) {
            setLikeStatus(false);
        } else {
            setLikeStatus(true);
        }
    }

    // 게시글 수정
    const modifyPost = () => {
        navigate(`/post/modify/${props.data._id}`)
    }
    // 게시글 삭제
    const deletePost = async () => {
        console.log(props.data._id);
        const result = await deleteData(`/posts/${props.data._id}`);
        console.log(props.data);
        alert("삭제 완료");
        navigate("/post");
    }
    
    const goChat =()=>{
        navigate("/messenger");
    }

    //About follow and unfollow
        const getFriends = async () => {
            try {
                const friendList = await getNoToken("/users/friends/" + user._id);
                setFriends(friendList.data);
            } catch (err) {
                console.log(err);
            }
        };


        // const handleClick = async () => {
        //     try {
        //       if (followed) {
        //         await axios.put(`/users/${user._id}/unfollow`, {
        //           userId: currentUser._id,
        //         });
        //         dispatch({ type: "UNFOLLOW", payload: user._id });
        //       } else {
        //         await axios.put(`/users/${user._id}/follow`, {
        //           userId: currentUser._id,
        //         });
        //         dispatch({ type: "FOLLOW", payload: user._id });
        //       }
        //       setFollowed(!followed);
        //     } catch (err) {
        //     }
        //   };


    //unfollow

    useEffect(()=>{
        getNumPeople();
        getLikeStatus();
        isJoined();
        getFriends();
    }, []);

    console.log( props );
    return (
        <div className="MainInfo">
            <Title title={props.data.title}/> <br />
            <div className='CompoWrap_flex topInfo'>
                <RecruitingBtn />
                <Amount price={props.data.price}/>
            </div>

            <div className='CompoWrap_flex middleInfo'>
                <div>
                { props.data.num_people != "" &&  <NumPeople current_people={numPeople ? numPeople : 1} num_people={props.data.num_people} /> }
                <Marchandise title="상품명 : " merchandise={props.data.merchandise}/>
                </div>
                <PerPayment perPayment={props.data.perPayment}/>
            </div>

            <div className='bottomInfo'>
                <Place title="모집 장소 : " place={props.data.place}/>
                <Date title="모집 기한 :" createdAt={props.data.createdAt} end_date={props.data.end_date}/>
            </div>

            <div className='CompoWrap_flex ReadBtn'>
                <LikeBtn like={likeStatus} onClick={likePost}/>
                <div className='BtnFlex'>
                    <JoinBtn title="채팅하기" onClick={goChat}/>
                    {/* 삼항연산자로 버튼 생성하기 작성자와 현재사용자 비교 */}
                    {
                        user._id == props.data.userId ? 
                        <>
                            <JoinBtn title="게시글 수정" onClick={modifyPost}/>
                            <JoinBtn title="게시글 삭제" onClick={deletePost}/>
                        </>
                            :
                            <div ref={button}>
                                <JoinBtn title="공동구매 참여" onClick={()=>setDoJoin(true)}/>
                            </div>
                    }
                    
                </div>
            </div>

            {doJoin && <Payments user={user} data={props.data} payComplete={payComplete} />}
        </div>
    )
}

export default MainInfo;