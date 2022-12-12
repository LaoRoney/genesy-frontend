import { useEffect, useState } from "react";
// import CollectCard from "../components/Market/CollectCard";
// import test from "../assets/1.png";
import { useTezosCollectStore } from "../store";
import { IoLink } from "react-icons/io5";
import user from "../assets/user.svg";
import { useParams } from "react-router-dom";
import { I_NFT } from "../utils/interface";
import { API_ENDPOINT } from "../utils/constants";
import axios from "axios";
import { getTezosPrice } from "../utils/price";
import spinner from "../assets/spinner.svg";
const Asset = () => {
  const { tokenId } = useParams();
  const { buyForSale, cancelForSale, listForSale, activeAddress } =
    useTezosCollectStore();
  const [marketState, setMarketState] = useState<boolean>(false);
  const [salePrice, setSalePrice] = useState<string>("");
  const [nftItem, setNftItem] = useState<I_NFT>({
    artist: "",
    description: "",
    imageLink: "",
    name: "",
    owner: "",
  });
  const onBuyForSale = async () => {
    // await buyForSale(domain?.tokenId || -1, domain?.price || 0);
    try {
      setMarketState(true);
      await buyForSale(parseFloat(tokenId!), nftItem?.price!);
      await axios.put(`${API_ENDPOINT}/nfts/${tokenId}`, {
        owner: activeAddress,
        price: 0,
      });
      setMarketState(false);
    } catch (error) {
      console.log(error);
      setMarketState(false);
    }
  };

  const onCancelForSale = async () => {
    try {
      setMarketState(true);
      await cancelForSale(parseFloat(tokenId!));
      await axios.put(`${API_ENDPOINT}/nfts/${tokenId}`, {
        price: 0,
      });
      setMarketState(false);
    } catch (error) {
      setMarketState(false);
      console.log(error);
    }
  };

  const onListForSale = async () => {
    let includingOperator = false;
    if (parseFloat(salePrice) > 0) {
      try {
        setMarketState(true);
        await listForSale(
          parseFloat(tokenId!),
          includingOperator,
          parseFloat(salePrice)
        );
        await axios.put(`${API_ENDPOINT}/nfts/${tokenId}`, {
          price: salePrice,
        });
        setMarketState(false);
      } catch (error) {
        setMarketState(false);
        console.log(error);
      }
    } else {
      console.log("Error");
    }
  };

  useEffect(() => {
    const loadNftItem = async () => {
      const { data: _nftItems }: { data: I_NFT } = await axios.get(
        `${API_ENDPOINT}/nfts/${tokenId}`
      );
      let _price = await getTezosPrice();
      console.log("_nftItems", _nftItems);
      console.log("_price", _price);
      // setPrice((_nftItems.price || 0) * _price);
      setNftItem(_nftItems);
    };
    loadNftItem();
  }, [tokenId, marketState]);
  return (
    <div className="max-w-[1024px] mx-auto py-24 sm:px-8 lg:px-0">
      <div className="flex gap-24">
        <img src={nftItem.imageLink} alt="test" className="w-1/2" />
        <div className="w-1/2 flex flex-col gap-4 justify-between">
          <div className="text-3xl font-bold">{nftItem.name}</div>
          <div>
            <div>__ CREATED BY</div>
            <div className="flex gap-2 items-center my-4">
              <img
                src={nftItem.artistObj?.avatarLink}
                alt="user"
                className="w-6 h-6"
              />
              <div className="text-2xl font-bold">
                {nftItem.artistObj?.username}
              </div>
            </div>
          </div>
          <div>
            <div>Collector's Circle</div>
            <div className="flex gap-4  my-4">
              <img src={user} alt="user" className="w-6 h-6" />
              <img src={user} alt="user" className="w-6 h-6" />
              <img src={user} alt="user" className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div>__ COLLECTED BY</div>
            <div className="flex gap-2 items-center  my-4">
              <img
                src={nftItem.ownerObj?.avatarLink}
                alt="user"
                className="w-6 h-6"
              />
              <div className="text-2xl font-bold">
                {nftItem.ownerObj?.username}
              </div>
            </div>
          </div>
          {activeAddress == nftItem.owner ? (
            nftItem.price == 0 || nftItem.price == null ? (
              <div>
                <div>
                  <div>
                    <input
                      type="text"
                      name="price"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      className="outline-none border-b border-black text-center my-4"
                      placeholder="Enter Price(XTZ)"
                    />
                    {/* <div>__ PRICE</div>
                    <div className="flex gap-2 items-center  my-4">
                      <div className="">
                        <span className="text-2xl font-bold">
                          {nftItem.price} XTZ
                        </span>
                        USD {String(price).slice(0, 5)}
                      </div>
                    </div> */}
                  </div>
                  <button
                    className="w-48 bg-black text-white py-2 hover:bg-gray-500"
                    onClick={() => onListForSale()}
                    disabled={marketState}
                  >
                    {marketState ? (
                      <div className="flex items-center justify-center">
                        <img
                          src={spinner}
                          alt="spinner"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                        />
                        LIST FOR SALE...
                      </div>
                    ) : (
                      <div>LIST FOR SALE</div>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <div>
                    <div>__ PRICE</div>
                    <div className="flex gap-2 items-center  my-4">
                      <div className="">
                        <span className="text-2xl font-bold">
                          {nftItem.price} XTZ
                        </span>
                        {/* USD {String(price).slice(0, 5)} */}
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-48 bg-black text-white py-2 hover:bg-gray-500"
                    onClick={() => onCancelForSale()}
                    disabled={marketState}
                  >
                    {marketState ? (
                      <div className="flex items-center justify-center">
                        <img
                          src={spinner}
                          alt="spinner"
                          className="inline mr-3 w-4 h-4 text-white animate-spin"
                        />
                        CANCEL SALE...
                      </div>
                    ) : (
                      <div>CANCEL SALE</div>
                    )}
                  </button>
                </div>
              </div>
            )
          ) : nftItem.price == 0 ? (
            <></>
          ) : (
            <div>
              <div>
                <div>__ PRICE</div>
                <div className="flex gap-2 items-center  my-4">
                  <div className="">
                    <span className="text-2xl font-bold">
                      {nftItem.price} XTZ
                    </span>
                    {/* USD {String(price).slice(0, 5)} */}
                  </div>
                </div>
              </div>
              <button
                className="w-32 bg-black text-white py-2 hover:bg-gray-500"
                onClick={() => onBuyForSale()}
              >
                BUY NOW
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold py-8">__ Description</div>
        <div className="py-4">{nftItem.description}</div>
        <div className="flex gap-4 py-2">
          <div>ROYALTIES</div>
          <div>8%</div>
        </div>
        <div className="flex gap-4 py-2">
          <div>ADDRESS</div>
          <div>KT1VLxr4LNMvwHs5TeEc2LzGapKFz5yuy1PW</div>
        </div>
        <div className="flex gap-4 font-bold py-4">
          <div className="flex items-center gap-4">
            <IoLink />
            <a
              href="https://ghostnet.tzkt.io/KT1VLxr4LNMvwHs5TeEc2LzGapKFz5yuy1PW/operations/"
              target="_blank"
              rel="noopener noreferrer"
            >
              TzKT
            </a>
          </div>
          <div className="flex items-center gap-4">
            <IoLink />
            <a
              href={nftItem.imageLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              IPFS
            </a>
          </div>
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold py-8">__ History</div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-8">
            <div>OCTOBER 21, 2022 7:47 PM</div>
            <div>
              <span className="font-bold">HACK </span>
              bought from
              <span className="font-bold"> ISKRA </span>
              for
              <span className="font-bold"> 700 XYZ</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>OCTOBER 21, 2022 7:47 PM</div>
            <div>
              <span className="font-bold">HACK </span>
              bought from
              <span className="font-bold"> ISKRA </span>
              for
              <span className="font-bold"> 700 XYZ</span>
            </div>
          </div>
          <div className="flex gap-8">
            <div>OCTOBER 21, 2022 7:47 PM</div>
            <div>
              <span className="font-bold">HACK </span>
              bought from
              <span className="font-bold"> ISKRA </span>
              for
              <span className="font-bold"> 700 XYZ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Asset;
