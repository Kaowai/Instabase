import { useEffect, useState } from 'react'
import { StoryFeed } from '../../models/story.model'
import { getSavedStoryByUserId } from '../../apis/storyService'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft } from 'react-icons/fi'
import { FadeLoader } from 'react-spinners'
import { formatDateString } from '../../utils/sharedFunctions'

const ArchiveStory = () => {
  const [saveStory, setListSavedStory] = useState<StoryFeed>()
  const userId = JSON.parse(sessionStorage.getItem('user') || '{}').userId
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    setLoading(true)
    getSavedStoryByUserId(userId)
      .then((res) => {
        setListSavedStory(res)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }, [])

  const handleBackToPersonal = () => {
    navigate(-1)
  }
  const handleNavigate = (storyId: string) => {
    navigate(`/stories/${saveStory?.userId}`, {
      state: { from: location.pathname, storyId: storyId }
    })
  }
  return (
    <section className='min-h-screen ml-[17rem]'>
      <div
        className={`w-[calc(100% - 40px)] gap-6 max-w-[935px] mx-auto pt-12 pb-20 flex justify-start flex-col items-start`}
      >
        <button
          onClick={handleBackToPersonal}
          className='flex justify-center gap-2 items-center border-none outline-none'
        >
          <FiArrowLeft size={24} />
          Archive
        </button>
        <span className='text-sm text-grey-color2'>
          Only you can see your archived stories unless you choose to share them.
        </span>
        <hr className='w-full text-grey-color3' />
        {loading ? (
          <div className='w-full flex justify-center items-center'>
            <FadeLoader height={15} margin={2} radius={2} width={4} />
          </div>
        ) : saveStory?.listStory?.length === 0 ? (
          <div className='w-full text-xl font-semibold  justify-start items-start'>
            You haven't have any archive story yet.
          </div>
        ) : (
          <div className='h-full w-full gap-8 grid grid-cols-4'>
            {saveStory?.listStory?.map((story) => (
              <div
                onClick={() => handleNavigate(story.storyId)}
                key={story.storyId}
                className='w-full h-full border-2 max-h-[460px] max-w-[260px] hover:scale-105 transition-all duration-200 rounded-lg relative'
              >
                <div className='p-2 absolute top-2 left-2 rounded-md bg-white/75'>
                  <span className='text-black font-semibold text-sm'>{formatDateString(story?.createdDate)}</span>
                </div>
                <img src={story.image} className='w-full h-full object-cover rounded-lg' />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ArchiveStory
