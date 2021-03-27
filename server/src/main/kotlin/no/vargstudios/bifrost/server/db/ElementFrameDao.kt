package no.vargstudios.bifrost.server.db

import no.vargstudios.bifrost.server.db.model.ElementFrameRow
import org.jdbi.v3.sqlobject.statement.SqlQuery
import org.jdbi.v3.sqlobject.statement.SqlUpdate

interface ElementFrameDao {

    @SqlUpdate(
        """
        insert into element_frames (id, element_id, number, transcoded)
        values (:frame.id, :frame.elementId, :frame.number, :frame.transcoded)
        """
    )
    fun insert(frame: ElementFrameRow)

    @SqlQuery("select * from element_frames where id = :id")
    fun get(id: String): ElementFrameRow?

    @SqlQuery("select * from element_frames where element_id = :elementId")
    fun listForElement(elementId: String): List<ElementFrameRow>

    @SqlQuery(
        """
        select *
        from element_frames frame
        where transcoded = false
          and (
            select framecount
            from elements element
            where element.id = frame.element_id
          ) = (
            select count(*)
            from element_frames frame2
            where frame2.element_id = frame.element_id
          )
        """
    )
    fun listReadyForTranscode(): List<ElementFrameRow>

    @SqlUpdate("update element_frames set transcoded = true where id = :id")
    fun setTranscoded(id: String)

    @SqlUpdate("delete from element_frames where element_id = :elementId")
    fun deleteForElement(elementId: String)

}
